import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MobileContext } from '../utils/contexts';
import ModalCompletableDetailsRoute from './CompletableDetailsModal';
import CompletableDetailsRoute from '../routes/CompletableDetailsRoute';
import IndexRoute from '../routes/IndexRoute';

type AppContentProps = {
  projectIds: Array<string> | null;
};

/**
 * Controls the routing for the application.
 */
function AppRoutes(props: AppContentProps): JSX.Element {
  const { projectIds } = props;
  return (
    <MobileContext.Consumer>
      {mobile =>
        mobile ? (
          <Switch>
            <Route exact path="/">
              {projectIds && <IndexRoute />}
            </Route>
            <Route
              path="/c/:completableType/:completableId"
              render={({ location: { key } }) =>
                projectIds && <CompletableDetailsRoute key={key} />
              }
            />
          </Switch>
        ) : (
          <>
            <Route path="/">{projectIds && <IndexRoute />}</Route>
            <Route path="/c/:completableType/:completableId">
              <ModalCompletableDetailsRoute />
            </Route>
          </>
        )
      }
    </MobileContext.Consumer>
  );
}

export default AppRoutes;
