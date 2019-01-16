import React, { Component } from 'react';
import { connect } from 'react-redux';
import { putUser } from '../../store/userListReducer';

class UserListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: props.user.role || 'SHOPPER',
    };
  }
  handleChange = evt => {
    this.setState({ userRole: evt.target.value });
  };
  handleSubmit = evt => {
    evt.preventDefault();
    this.props.editUser(this.props.user.id, { role: this.state.userRole });
  };
  handleDelete = evt => {
    this.props.deleteClicked(this.props.user.id);
  };
  render() {
    return (
      <li className="m-3">
        <div className="flex">
          <p className="m-2">{this.props.user.email}</p>
          <button
            onClick={this.handleDelete}
            className="btn-warning m-2 rounded mr-4 quarterMasterBtn"
            type="button"
          >
            {' '}
            Remove User{' '}
          </button>
          <form onSubmit={this.handleSubmit}>
            <select
              name="role"
              className="form-control"
              value={this.state.userRole}
              onChange={this.handleChange}
            >
              <option value="ADMIN">Admin</option>
              <option value="SHOPPER">Shopper</option>
            </select>
            <button type="submit" className="btn quarterMasterBtn m-1">
              {' '}
              Save{' '}
            </button>
          </form>
        </div>
      </li>
    );
  }
}

const mapDispatch = dispatch => ({
  editUser: (id, editedUser) => dispatch(putUser(id, editedUser)),
});

export default connect(
  null,
  mapDispatch
)(UserListing);
