import React, { Component } from 'react';
import './App.css';
import Layout from './compoents/Layout';

class App extends Component {

  constructor() {
    super();
    this.state = {title: '', body: '', response: {}, isSubmited: false, isValid: false};
    this.url = `http://localhost:5000`;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetch = this.fetch.bind(this)
 }

handleSubmit(event) {
    event.preventDefault();
    if (!event.target.checkValidity()) {
        // form is invalid! so we do nothing
        return;
    }
    if(this.state.body.length < 140){
      this.setState({response: {statusText: "Body Size should be 140 characters long"}});
      return;
    }
    this.setState({isValid: true});
    //Set the isSubmitted true for showing the response to the user
    this.setState({isSubmited: true});
    this.fetch(`${this.url}/send`, {
        method: 'POST',
        body: JSON.stringify(this.state)
      }).then(res => {
        this.setState({response: res});
      }).catch(err => {
        this.setState({response: err});
    });
}

fetch(url, options){
  // performs api calls sending the required authentication headers
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  return fetch(url, {
    headers,
    ...options
  })
}

handleChange = (event) => {
  switch(event.target.name){
      case "title":
          this.setState({title: event.target.value});
          break;
      case "body":
          this.setState({body: event.target.value});
          break;
      default:
        this.setState({body: '', title: ''});
  }
};

  render() {
    let status = null;
    //showing the response of the backend by sending the data from the client to the user.
    if(this.state.isSubmited===true){
            if(this.state.isValid === false){
              status =  <div className="uk-alert-warning" uk-alert="true">
                            <p>{this.state.response.statusText}</p>
                    </div>;
            }
            if(this.state.response.ok===false){
            status =  <div className="uk-alert-warning" uk-alert="true">
                            <p>{this.state.response.statusText}, text is too big to send the email, please make it short</p>
                    </div>;
            } else {
                status = <div className="uk-alert-success" uk-alert="true">
                            <p>Your email has been send</p>
                        </div>;
            }
    }
    return (
      <Layout title="Send Email">
        {status}
        <form onSubmit={this.handleSubmit}>
          <fieldset className="uk-fieldset">
            <legend className="uk-legend">Send New Email</legend>

              <div className="uk-margin">
                  <input className="uk-input"  name="title" type="text" onChange={this.handleChange} placeholder="Subject" required/>
              </div>

              <div className="uk-margin">
                  <textarea className="uk-textarea" name="body" onChange={this.handleChange} rows="5" placeholder="Body" required></textarea>
              </div>

              <div className="uk-margin">
                  <button type="submit" className="uk-button uk-button-primary">Submit</button>
              </div>
          </fieldset>
        </form>
      </Layout>
    );
  }
}

export default App;
