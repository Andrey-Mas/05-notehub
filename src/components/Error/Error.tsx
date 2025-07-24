import css from "./Error.module.css";

interface ErrorProps {
  message?: string;
}

function Error({ message = "Something went wrong." }: ErrorProps) {
  return <div className={css.error}>{message}</div>;
}

export default Error;
