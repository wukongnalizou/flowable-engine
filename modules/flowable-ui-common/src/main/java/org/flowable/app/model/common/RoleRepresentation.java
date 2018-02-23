package org.flowable.app.model.common;


import org.flowable.idm.api.Role;

public class RoleRepresentation {
    protected String id;
    protected String name;

    public RoleRepresentation(Role role) {
        setId(role.getId());
        setName(role.getName());
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
