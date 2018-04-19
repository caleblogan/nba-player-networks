import React from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Form, Header, Input} from "semantic-ui-react";

import styles from './InfoBoxMobile.scss';

const InfoBoxMobile = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  selectedPlayer,
  onCheck,
  shouldRenderAllLinks,
}) => {
  return (
    <div className={styles.infoBox}>
      <Header as="h4" className={styles.selectedPlayer}>Selected Player: {selectedPlayer.name}</Header>
      <Form className={styles.Form}>
        <Form.Input
          value={searchValue}
          className={styles.search}
          placeholder="search player..."
          onChange={onSearchChange}
          action={{ content: 'Search', onClick: onSearchSubmit }}
        />
        <Form.Checkbox
          label="display links"
          onChange={onCheck}
          checked={shouldRenderAllLinks}
        />
      </Form>
      {/*<div className={styles.legend}>*/}
        {/*<ul>*/}
          {/*<li><div className={styles.box} style={{background: "#0154FA"}}/>line: mutual follow</li>*/}
          {/*<li><div className={styles.box} style={{background: "#fa2405"}}/>line: outgoing follow</li>*/}
          {/*<li><div className={[styles.circle, styles.box].join(' ')} style={{background: "#040aff"}}/>size: n incoming player follows</li>*/}
        {/*</ul>*/}
      {/*</div>*/}
    </div>
  );
};

InfoBoxMobile.propTypes = {

};

export default InfoBoxMobile;
