/*
  Author: Joseph Sikowitz
  November 2026

  Error message element
*/

import PropTypes from "prop-types";

import "./ErrorMessage.css";

export default function ErrorMessage(msg) {
  return (
    <div className="alert warning">{msg.msg.replace(/'/g, '')}</div>
  );
}

ErrorMessage.PropTypes = {
  msg: PropTypes.string.isRequired
}