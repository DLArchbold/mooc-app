import { useNavigate } from "react-router-dom";
import React from 'react';

function withNavigation(Component) {
  return props => <Component {...props} navigate={useNavigate()} />;
}
 
export default withNavigation