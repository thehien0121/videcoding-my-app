import { supabase } from './supabaseClient';

// Lấy danh sách bạn bè đã xác nhận
export async function getFriends(userId) {
  console.log(`Getting friends for user: ${userId}`);

  try {
    const { data, error } = await supabase
      .from('friends')
      .select('friend_id, users:friend_id(display_name, avatar_url, id, language)')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error("Error fetching friends:", error);
      throw error;
    }

    console.log("Raw data from Supabase:", data);

    if (!data || data.length === 0) {
      console.log("No friends found for user", userId);
      return [];
    }

    const mappedData = data.map(item => {
      console.log("Mapping friend item:", item);
      if (!item.users) {
        console.error("Friend data missing users object:", item);
        return null;
      }
      return {
        id: item.users.id,
        name: item.users.display_name,
        avatar: item.users.avatar_url,
        language: item.users.language,
      };
    }).filter(item => item !== null);

    console.log("Returning mapped friends data:", mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error in getFriends:', error);
    throw error;
  }
}

// Lấy lời mời kết bạn (pending, mình là người nhận)
export async function getFriendRequests(userId) {
  console.log(`Getting friend requests for user: ${userId}`);

  try {
    const { data, error } = await supabase
      .from('friends')
      .select('id, user_id, users:user_id(display_name, avatar_url, id, language)')
      .eq('friend_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error("Error fetching friend requests:", error);
      throw error;
    }

    console.log("Raw friend requests from Supabase:", data);

    if (!data || data.length === 0) {
      console.log("No friend requests found for user", userId);
      return [];
    }

    const mappedData = data.map(item => {
      console.log("Mapping request item:", item);
      if (!item.users) {
        console.error("Request data missing users object:", item);
        return null;
      }
      return {
        requestId: item.id,
        id: item.users.id,
        name: item.users.display_name,
        avatar: item.users.avatar_url,
        language: item.users.language,
      };
    }).filter(item => item !== null);

    console.log("Returning mapped friend requests:", mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error in getFriendRequests:', error);
    throw error;
  }
}

// Tìm kiếm user chưa là bạn
export async function searchUsers(query, userId) {
  console.log(`[BACKEND] Searching users with query: ${query} for user: ${userId}`);

  try {
    const { data: allUsers, error } = await supabase
      .from('users')
      .select('id, display_name, avatar_url, language')
      .ilike('display_name', `%${query}%`);
    if (error) throw error;
    console.log('[BACKEND] allUsers from Supabase:', allUsers);
    if (!allUsers || allUsers.length === 0) {
      console.warn('[BACKEND] No users found with display_name like:', query);
    }
    const { data: friends } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId)
      .eq('status', 'accepted');
    const friendIds = friends ? friends.map(f => f.friend_id) : [];
    console.log('[BACKEND] friendIds:', friendIds);
    const filtered = allUsers.filter(u => u.id !== userId && !friendIds.includes(u.id));
    console.log('[BACKEND] Final filtered search results:', filtered);
    return filtered;
  } catch (error) {
    console.error('[BACKEND] Error in searchUsers:', error);
    throw error;
  }
}

// Chấp nhận lời mời kết bạn
export async function acceptFriendRequest(requestId) {
  console.log(`Accepting friend request: ${requestId}`);

  try {
    // Lấy thông tin về lời mời kết bạn trước khi chấp nhận
    const { data: requestData, error: requestError } = await supabase
      .from('friends')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError) {
      console.error("Error fetching friend request:", requestError);
      throw requestError;
    }

    console.log("Friend request to accept:", requestData);

    // Cập nhật trạng thái thành accepted
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', requestId)
      .select();

    if (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }

    console.log('Friend request accepted successfully:', data);

    // Cần tạo thêm quan hệ ngược lại để có thể tìm kiếm bạn theo 2 chiều
    if (data && data.length > 0) {
      const request = data[0];

      // Kiểm tra xem mối quan hệ ngược đã tồn tại chưa
      const { data: existingRelation, error: checkError } = await supabase
        .from('friends')
        .select('id, status')
        .eq('user_id', request.friend_id)
        .eq('friend_id', request.user_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {  // PGRST116 là "không tìm thấy"
        console.error("Error checking reverse friendship:", checkError);
        throw checkError;
      }

      if (existingRelation) {
        // Nếu đã tồn tại, cập nhật trạng thái
        console.log(`Updating existing reverse friendship: ${request.friend_id} -> ${request.user_id}`);
        const { data: updateData, error: updateError } = await supabase
          .from('friends')
          .update({ status: 'accepted' })
          .eq('id', existingRelation.id)
          .select();

        if (updateError) {
          console.error("Error updating reverse friendship:", updateError);
          throw updateError;
        }

        console.log("Reverse friendship updated:", updateData);
      } else {
        // Nếu chưa tồn tại, tạo mới
        console.log(`Creating new reverse friendship: ${request.friend_id} -> ${request.user_id}`);
        const { data: insertData, error: insertError } = await supabase
          .from('friends')
          .insert([{
            user_id: request.friend_id,
            friend_id: request.user_id,
            status: 'accepted'
          }])
          .select();

        if (insertError) {
          console.error("Error creating reverse friendship:", insertError);
          throw insertError;
        }

        console.log("Reverse friendship created:", insertData);
      }
    }

    return data;
  } catch (error) {
    console.error('Error in acceptFriendRequest:', error);
    throw error;
  }
}

// Từ chối lời mời kết bạn
export async function declineFriendRequest(requestId) {
  console.log(`Declining friend request: ${requestId}`);

  try {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'declined' })
      .eq('id', requestId);

    if (error) throw error;

    console.log('Friend request declined successfully');
    return data;
  } catch (error) {
    console.error('Error in declineFriendRequest:', error);
    throw error;
  }
}

// Xóa bạn
export async function removeFriend(userId, friendId) {
  console.log(`Removing friendship between ${userId} and ${friendId}`);

  try {
    // Xóa mối quan hệ từ userId đến friendId
    const { error: error1 } = await supabase
      .from('friends')
      .delete()
      .eq('user_id', userId)
      .eq('friend_id', friendId);

    if (error1) throw error1;

    // Xóa mối quan hệ ngược lại từ friendId đến userId
    const { error: error2 } = await supabase
      .from('friends')
      .delete()
      .eq('user_id', friendId)
      .eq('friend_id', userId);

    if (error2) throw error2;

    console.log('Friendship removed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}

// Gửi lời mời kết bạn
export async function sendFriendRequest(fromUserId, toUserId) {
  console.log(`Sending friend request from ${fromUserId} to ${toUserId}`);

  try {
    const { data, error } = await supabase.from('friends').insert([
      { user_id: fromUserId, friend_id: toUserId, status: 'pending' }
    ]);

    if (error) throw error;

    console.log('Friend request sent successfully');
    return data;
  } catch (error) {
    console.error('Error in sendFriendRequest:', error);
    throw error;
  }
}
