package org.flowable.app.rest.editor;


import org.flowable.app.model.common.*;
import org.flowable.app.service.idm.RemoteIdmService;
import org.flowable.idm.api.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class EditorRolesResource {

    @Autowired
    protected RemoteIdmService remoteIdmService;


    /**
     * find roles by filter
     */
    @RequestMapping(value = "/rest/editor-roles", method = RequestMethod.GET)
    public ResultListDataRepresentation getUserRoles(@RequestParam(required = false, value = "filter") String filter) {
        List<RoleRepresentation> result = new ArrayList<>();
        List<RemoteRole> roles = remoteIdmService.getRolesByNameFilter(filter);
        for (Role role : roles) {
            result.add(new RoleRepresentation(role));
        }
        return new ResultListDataRepresentation(result);
    }

}