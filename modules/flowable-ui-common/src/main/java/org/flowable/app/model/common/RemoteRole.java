package org.flowable.app.model.common;



import org.flowable.idm.api.Role;

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
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }


}
