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
package org.flowable.app.service.idm;

import org.flowable.app.model.common.RemoteGroup;
import org.flowable.app.model.common.RemoteToken;
import org.flowable.app.model.common.RemoteUser;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 暂时用不到，提供一个空实现
 */
@Service
public class RemoteIdmServiceImpl implements RemoteIdmService {

    @Override
    public RemoteUser authenticateUser(String username, String password) {
        return null;
    }

    @Override
    public RemoteToken getToken(String tokenValue) {
        return null;
    }

    @Override
    public RemoteUser getUser(String userId) {
        return null;
    }

    @Override
    public List<RemoteUser> findUsersByNameFilter(String filter) {
        return null;
    }

    @Override
    public List<RemoteUser> findUsersByGroup(String groupId) {
        return null;
    }

    @Override
    public RemoteGroup getGroup(String groupId) {
        return null;
    }

    @Override
    public List<RemoteGroup> findGroupsByNameFilter(String filter) {
        return null;
    }

}
