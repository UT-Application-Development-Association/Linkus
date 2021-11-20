import cn from "classnames";
import './style.scss';
import { isNone } from "../../utils";

const Button = (props) => {
  const { type, size, radius, className, width, style, children, ...restAsHTMLAttr } = props;

  return (
    <button
      style={{
        ...(isNone(radius) ? {} : { borderRadius: radius } ),
        ...(isNone(width) ? {} : { width } ),
        ...style
      }}
      className={cn({
        [className]: className,
        btn: true,
        [`btn-${size}`]: size,
        [`btn-${type}`]: type,
      })}
      {...restAsHTMLAttr}
    >
      {children}
    </button>
  );
};

export default Button;
