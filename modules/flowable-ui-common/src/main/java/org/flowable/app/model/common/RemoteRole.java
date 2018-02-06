package org.flowable.app.model.common;


import com.proper.enterprise.platform.api.auth.model.*;

import java.util.Collection;

public class RemoteRole implements Role {

    protected String id;
    protected String name;

    public RemoteRole() {

    }

    public RemoteRole(String id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String getCreateUserId() {
        return null;
    }

    @Override
    public void setCreateUserId(String s) {

    }

    @Override
    public String getCreateTime() {
        return null;
    }

    @Override
    public void setCreateTime(String s) {

    }

    @Override
    public String getLastModifyUserId() {
        return null;
    }

    @Override
    public void setLastModifyUserId(String s) {

    }

    @Override
    public String getLastModifyTime() {
        return null;
    }

    @Override
    public void setLastModifyTime(String s) {

    }

    @Override
    public boolean isValid() {
        return false;
    }

    @Override
    public void setValid(boolean b) {

    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getDescription() {
        return null;
    }

    @Override
    public void setDescription(String s) {

    }

    @Override
    public boolean isEnable() {
        return false;
    }

    @Override
    public void setEnable(boolean b) {

    }

    @Override
    public Role getParent() {
        return null;
    }

    @Override
    public void setParent(Role role) {

    }

    @Override
    public Collection<? extends User> getUsers() {
        return null;
    }

    @Override
    public Collection<? extends UserGroup> getUserGroups() {
        return null;
    }

    @Override
    public Collection<? extends Menu> getMenus() {
        return null;
    }

    @Override
    public Collection<? extends Resource> getResources() {
        return null;
    }

    @Override
    public void add(Collection<? extends Menu> collection) {

    }

    @Override
    public void remove(Collection<? extends Menu> collection) {

    }

    @Override
    public void addResources(Collection<? extends Resource> collection) {

    }

    @Override
    public void removeResources(Collection<? extends Resource> collection) {

    }
}
