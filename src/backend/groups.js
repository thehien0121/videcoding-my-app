import { supabase } from './supabaseClient';

// Lấy danh sách nhóm user đã tham gia
export async function getMyGroups(userId) {
  // Lấy group_id user đã tham gia
  const { data: memberRows, error: memberError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId);
  if (memberError) throw memberError;
  const groupIds = memberRows.map(row => row.group_id);
  if (groupIds.length === 0) return [];
  // Lấy thông tin nhóm và số thành viên
  const { data: groups, error: groupError } = await supabase
    .from('groups')
    .select('id, name, description, cover_image, privacy');
  if (groupError) throw groupError;
  // Đếm số thành viên cho từng nhóm
  const groupList = await Promise.all(groups.filter(g => groupIds.includes(g.id)).map(async g => {
    const { count } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', g.id);
    return { ...g, member_count: count || 0, joined: true };
  }));
  return groupList;
}

// Lấy nhóm gợi ý (chưa tham gia)
export async function getSuggestedGroups(userId) {
  const { data: memberRows, error: memberError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId);
  if (memberError) throw memberError;
  const joinedIds = memberRows.map(row => row.group_id);
  const { data: groups, error: groupError } = await supabase
    .from('groups')
    .select('id, name, description, cover_image, privacy');
  if (groupError) throw groupError;
  // Chỉ lấy nhóm chưa tham gia
  const groupList = await Promise.all(groups.filter(g => !joinedIds.includes(g.id)).map(async g => {
    const { count } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', g.id);
    return { ...g, member_count: count || 0, joined: false };
  }));
  return groupList;
}

// Tìm kiếm nhóm theo tên, trả về trạng thái đã tham gia hay chưa
export async function searchGroups(query, userId) {
  const { data: groups, error: groupError } = await supabase
    .from('groups')
    .select('id, name, description, cover_image, privacy')
    .ilike('name', `%${query}%`);
  if (groupError) throw groupError;
  // Lấy danh sách nhóm user đã tham gia
  const { data: memberRows } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', userId);
  const joinedIds = memberRows.map(row => row.group_id);
  const groupList = await Promise.all(groups.map(async g => {
    const { count } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', g.id);
    return { ...g, member_count: count || 0, joined: joinedIds.includes(g.id) };
  }));
  return groupList;
}

// Tạo nhóm mới
export async function createGroup({ name, description, privacy, cover_image, created_by }) {
  // Tạo nhóm
  const { data: group, error } = await supabase
    .from('groups')
    .insert([{ name, description, privacy, cover_image, created_by }])
    .select()
    .single();
  if (error) throw error;
  // Thêm user vào group_members
  const { error: memberError } = await supabase
    .from('group_members')
    .insert([{ user_id: created_by, group_id: group.id, role: 'admin' }]);
  if (memberError) throw memberError;
  return group;
}

// Tham gia nhóm
export async function joinGroup(userId, groupId) {
  const { error } = await supabase
    .from('group_members')
    .insert([{ user_id: userId, group_id: groupId, role: 'member' }]);
  if (error) throw error;
}
// Rời nhóm
export async function leaveGroup(userId, groupId) {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('user_id', userId)
    .eq('group_id', groupId);
  if (error) throw error;
}
