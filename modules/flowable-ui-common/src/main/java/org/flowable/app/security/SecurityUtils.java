/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.flowable.app.security;

import com.proper.enterprise.platform.api.auth.service.UserService;
import com.proper.enterprise.platform.core.PEPApplicationContext;
import org.flowable.app.model.common.RemoteUser;
import org.flowable.idm.api.User;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Utility class to integrate PEP authc and authz into Flowable.
 */
public final class SecurityUtils {

    private static User assumeUser;

    private SecurityUtils() {
    }

    private static UserService getUserService() {
        return PEPApplicationContext.getBean(UserService.class);
    }

    /**
     * Get the login of the current user.
     */
    public static String getCurrentUserId() {
        com.proper.enterprise.platform.api.auth.model.User user = getUserService().getCurrentUser();
        if (user != null) {
            return user.getId();
        }
        return null;
    }

    /**
     * @return the {@link User} object associated with the current logged in user.
     */
    public static User getCurrentUserObject() {
        if (assumeUser != null) {
            return assumeUser;
        }

        User user = null;
        FlowableAppUser appUser = getCurrentFlowableAppUser();
        if (appUser != null) {
            user = appUser.getUserObject();
        }
        return user;
    }

    public static FlowableAppUser getCurrentFlowableAppUser() {
        com.proper.enterprise.platform.api.auth.model.User curUser = getUserService().getCurrentUser();
        User user = new RemoteUser();
        user.setId(curUser.getId());
        user.setPassword(curUser.getPassword());
        user.setEmail(curUser.getEmail());
        user.setLastName(curUser.getUsername());

        Collection<? extends GrantedAuthority> collection = new ArrayList<>();
        return new FlowableAppUser(user, user.getId(), collection);
    }

    public static boolean currentUserHasCapability(String capability) {
//        FlowableAppUser user = getCurrentFlowableAppUser();
//        for (GrantedAuthority grantedAuthority : user.getAuthorities()) {
//            if (capability.equals(grantedAuthority.getAuthority())) {
//                return true;
//            }
//        }
//        return false;
        return true;
    }

    public static void assumeUser(User user) {
        assumeUser = user;
    }

    public static void clearAssumeUser() {
        assumeUser = null;
    }

}
