package org.flowable.idm.engine.impl.persistence.entity;

import org.flowable.engine.common.impl.db.HasRevision;
import org.flowable.engine.common.impl.persistence.entity.AbstractEntity;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class RoleEntityImpl extends AbstractEntity implements RoleEntity, Serializable, HasRevision {

    private String name;

    @Override
    public Object getPersistentState() {
        Map<String, Object> persistentState = new HashMap<>();
        persistentState.put("name", name);
        return persistentState;
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
