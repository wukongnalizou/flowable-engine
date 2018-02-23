package org.flowable.idm.engine.impl.persistence.entity;

import org.flowable.engine.common.impl.db.HasRevision;
import org.flowable.engine.common.impl.persistence.entity.Entity;
import org.flowable.idm.api.Role;

public interface RoleEntity extends Role, Entity, HasRevision {
}