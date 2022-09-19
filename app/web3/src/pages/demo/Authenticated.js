import CardWeb3 from "./CardWeb3";
import classes from "./Authenticated.module.css";

const Authenticated = (props) => {
  return (
    <CardWeb3 className={classes.home}>
      <h1>Welcome</h1>
      <p>{props.currentAccount}</p>
      <p>Current Network: {props.currentNetwork}</p>
    </CardWeb3>
  );
};
export default Authenticated;
