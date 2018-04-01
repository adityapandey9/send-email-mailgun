import React, { Component } from 'react';
import Title from './Title';

export default class Layout extends Component {
    render(){
        return(
            <div className="uk-panel">
            <div className="body">
              <Title name={this.props.title} />
              <div className="child-body">{this.props.children}</div>
            </div>
                 <style jsx="true">{`
                 :global(body) {
                   margin: 0;
                 }
                 .body {
                   height:100%;
                   text-align: center;
                   margin-bottom: 5em;
                 }
                 .child-body {
                  margin-left: 13%;
                  margin-right: 13%;
                 }
             `}</style>
            </div>
        );
    }
}