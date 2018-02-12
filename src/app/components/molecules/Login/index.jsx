import Inferno from "inferno";

import "./style.scss";

export default ({ user }) =>
  user ? (
    <div className="Login">{JSON.stringify(user)}</div>
  ) : (
    <div className="Login">
      <a
        href={`https://discordapp.com/api/oauth2/authorize?client_id=394792378336280576&permissions=1024&redirect_uri=https%3A%2F%2Fchorus.fightthe.pw&response_type=code&scope=guilds%20identify%20bot`}
      >
        Login with Discord
      </a>
    </div>
  );
