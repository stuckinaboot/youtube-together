import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import CreateSession from "./components/session/CreateSession";
import Session from "./components/session/Session";

function App() {
  const [leader, setLeader] = useState(false);
  const [sessionID, setSessionID] = useState(null);
  const [videoID, setVideoID] = useState(null);
  const [action, setAction] = useState("join");

  const createSession = (vidID, session, leaderbool) => {
    setVideoID(vidID);
    setSessionID(session);
    setLeader(leaderbool);
    setAction("create");
  };
  return (
    <Router>
      <div className="skewed"></div>
      <div className="container">
        <main className="content">
          <Switch>
            <Route
              path="/start/:sessionID/:videoUrl"
              render={() => <CreateSession session={createSession} />}
            />
            <Route
              path="/watch/:sessionID/:leaderName?"
              render={() => (
                <Session
                  leader={leader}
                  sessionID={sessionID}
                  videoID={videoID}
                  action={action}
                />
              )}
            />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
