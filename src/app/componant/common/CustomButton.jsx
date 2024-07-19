import React from "react";
import PropTypes from "prop-types";

const CustomButton = ({
  children,
  onClick,
  type,
  className,
  size,
  variant,
  isPill,
  isDisabled,
}) => {
  const baseStyle =
    "   rounded-2xl focus:outline-none  w-full";
  const pillStyle = isPill ? "rounded-full" : "";
  const sizeStyle =
    size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base";
  const disabledStyle = isDisabled ? "cursor-not-allowed opacity-50" : "";

  let variantStyle;
  switch (variant) {
    case "primary":
      variantStyle =
        "text-white text-center font-semibold lg:my-2 my-2 group rounded-2xl relative inline-flex items-center justify-center lg:px-6 py-3 px-4 overflow-hidden font-bold bg-gradient-to-r from-[#8750f7] to-[#58339c] hover:bg-gradient-to-r hover:from-[#58339c] hover:to-[#8750f7] transition-all";
      break;
    case "secondary":
      variantStyle =
        "lg:my-0 my-2 group rounded-full relative inline-flex items-center justify-start lg:px-6 py-3 px-4 overflow-hidden font-bold border border-crimson-Purple-border text-crimson-Purple-text hover:bg-gradient-to-r hover:bg-crimson-Purple hover:text-white transition-all";
      break;
    case "success":
      variantStyle = "text-white text-center font-semibold lg:my-2 my-2 group rounded-lg relative inline-flex items-center justify-center lg:px-6 py-3 px-4 overflow-hidden font-bold bg-gradient-to-r from-[#0505057a] to-[#888585] hover:bg-gradient-to-r hover:from-[#888585] hover:to-[#0505057a]  transition-all";
      break;
    case "danger":
      variantStyle = "bg-red-500 hover:bg-red-700 text-white";
      break;
    default:
      variantStyle = "bg-gray-500 hover:bg-gray-700 text-white";
      break;
  }

  return (
    <button
      type={type}
      className={`${baseStyle} ${pillStyle} ${sizeStyle} ${variantStyle} ${className} ${disabledStyle}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger"]),
  isPill: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default CustomButton;
