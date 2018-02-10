import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Counter from '../components/Counter';

function mapStoreToProps(state) {
  return {
    value: state
  };
}

const App = (props) => {
  return (
    <Fragment>
      <h1>If I can see this in the HTML output (view source) then I just implemented SSR!!! 🎉</h1>
      
      <Counter
        value={props.value}
        onIncrement={() => props.dispatch({ type: 'INCREMENT' })}
        onDecrement={() => props.dispatch({ type: 'DECREMENT' })}
      />
    </Fragment>
  );
};

App.propTypes = {
  value: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStoreToProps)(App);