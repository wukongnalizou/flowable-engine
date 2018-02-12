package org.flowable.idm.engine.impl;

import com.proper.enterprise.platform.api.auth.model.Role;
import com.proper.enterprise.platform.api.auth.model.UserGroup;
import com.proper.enterprise.platform.api.auth.service.UserService;
import com.proper.enterprise.platform.core.PEPApplicationContext;
import org.flowable.idm.api.*;
import org.flowable.idm.engine.impl.persistence.entity.GroupEntityImpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class PEPIdmIdentityServiceImpl implements IdmIdentityService {

    @Override
    public User newUser(String userId) {
        return null;
    }

    @Override
    public void saveUser(User user) {

    }

    @Override
    public void updateUserPassword(User user) {

    }

    @Override
    public UserQuery createUserQuery() {
        return null;
    }

    @Override
    public NativeUserQuery createNativeUserQuery() {
        return null;
    }

    @Override
    public void deleteUser(String userId) {

    }

    @Override
    public Group newGroup(String groupId) {
        return null;
    }

    @Override
    public List<Group> queryGroupByUserId(String userId) {
        try {
            Collection<? extends UserGroup> userGroups = getUserService().getUserGroups(userId);
            return GroupConvert.convert(userGroups);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @Override
    public List<Role> queryRoleByUserId(String userId) {
        try {
            Collection<? extends Role> roles = getUserService().getUserRoles(userId);
            return new ArrayList<>(roles);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @Override
    public GroupQuery createGroupQuery() {
        return null;
    }

    @Override
    public NativeGroupQuery createNativeGroupQuery() {
        return null;
    }

    @Override
    public void saveGroup(Group group) {

    }

    @Override
    public void deleteGroup(String groupId) {

    }

    @Override
    public void createMembership(String userId, String groupId) {

    }

    @Override
    public void deleteMembership(String userId, String groupId) {

    }

    @Override
    public boolean checkPassword(String userId, String password) {
        return false;
    }

    @Override
    public void setUserPicture(String userId, Picture picture) {

    }

    @Override
    public Picture getUserPicture(String userId) {
        return null;
    }

    @Override
    public Token newToken(String id) {
        return null;
    }

    @Override
    public void saveToken(Token token) {

    }

    @Override
    public void deleteToken(String tokenId) {

    }

    @Override
    public TokenQuery createTokenQuery() {
        return null;
    }

    @Override
    public NativeTokenQuery createNativeTokenQuery() {
        return null;
    }

    @Override
    public void setUserInfo(String userId, String key, String value) {

    }

    @Override
    public String getUserInfo(String userId, String key) {
        return null;
    }

    @Override
    public List<String> getUserInfoKeys(String userId) {
        return null;
    }

    @Override
    public void deleteUserInfo(String userId, String key) {

    }

    @Override
    public Privilege createPrivilege(String privilegeName) {
        return null;
    }

    @Override
    public void addUserPrivilegeMapping(String privilegeId, String userId) {

    }

    @Override
    public void deleteUserPrivilegeMapping(String privilegeId, String userId) {

    }

    @Override
    public void addGroupPrivilegeMapping(String privilegeId, String groupId) {

    }

    @Override
    public void deleteGroupPrivilegeMapping(String privilegeId, String groupId) {

    }

    @Override
    public List<PrivilegeMapping> getPrivilegeMappingsByPrivilegeId(String privilegeId) {
        return null;
    }

    @Override
    public void deletePrivilege(String privilegeId) {

    }

    @Override
    public List<User> getUsersWithPrivilege(String privilegeId) {
        return null;
    }

    @Override
    public List<Group> getGroupsWithPrivilege(String privilegeId) {
        return null;
    }

    @Override
    public PrivilegeQuery createPrivilegeQuery() {
        return null;
    }

    private UserService getUserService() {
        return PEPApplicationContext.getBean(UserService.class);
    }

    private static class GroupConvert {

        public static Group convert(UserGroup userGroup) {
            Group group = new GroupEntityImpl();
            group.setId(userGroup.getId());
            group.setName(userGroup.getName());
            return group;
        }

        public static List<Group> convert(Collection<? extends UserGroup> userGroups) {
            List<Group> groups = new ArrayList<>();
            for (UserGroup userGroup : userGroups) {
                groups.add(convert(userGroup));
            }
            return groups;
        }
    }
}
