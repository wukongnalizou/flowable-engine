package org.flowable.app.rest.editor;

import com.proper.enterprise.platform.api.auth.annotation.AuthcIgnore;
import com.proper.enterprise.platform.api.auth.model.Role;
import com.proper.enterprise.platform.core.controller.BaseController;
import org.flowable.app.model.common.*;
import org.flowable.app.service.idm.RemoteIdmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class EditorRolesResource extends BaseController {

    @Autowired
    protected RemoteIdmService remoteIdmService;


    /**
     * 根据用户角色名字，查找相近的，返回
     *
     * @author sunshuai
     */
    @AuthcIgnore
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
