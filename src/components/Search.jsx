import React from 'react';
import PropTypes from 'prop-types';

import Input from './SearchStyles';

const Search = ({ onChange }) => (
  <Input onChange={onChange} />
);

Search.propTypes = {
  onChange: PropTypes.func
};

export default Search;
