import classes from "./Card.module.css";

const CardWeb3 = (props) => {
  return (
    <div className={`${classes.card} ${props.className}`}>{props.children}</div>
  );
};

export default CardWeb3;
