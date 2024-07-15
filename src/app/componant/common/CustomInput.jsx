import PropTypes from "prop-types";

const CustomInput = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  className,
  size,
  leftIcon,
  rightIcon,
  isDisabled,
}) => {
  const baseStyle =
    "border-2 rounded-2xl py-4 px-3 my-2 focus:outline-none focus:shadow-outline";
  const sizeStyle =
    size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base";
  const disabledStyle = isDisabled ? "cursor-not-allowed opacity-50" : "";
  const iconPaddingStyle = leftIcon || rightIcon ? "pl-10 pr-10" : "";

  // Style to disable autofill
  const autofillStyle = {
    WebkitBoxShadow: "0 0 0 1000px white inset", // Override autofill background color
  };

  return (
    <div className={`relative ${className}`}>
      {leftIcon && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          {leftIcon}
        </span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseStyle} ${sizeStyle} ${iconPaddingStyle} ${disabledStyle} w-full`}
        style={autofillStyle} 
        disabled={isDisabled}
      />
      {rightIcon && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {rightIcon}
        </span>
      )}
    </div>
  );
};

CustomInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  isDisabled: PropTypes.bool,
};

export default CustomInput;
