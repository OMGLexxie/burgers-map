import React, {Component} from 'react'

class MapError extends Component {
  state = {
    show: false,
    timeout: null
  }

  componentDidMount = () => {
    let timeout = window.setTimeout(this.showError, 800);
    this.setState({timeout});
  }

    // we clear the timeout
  componentWillUnmount = () => {
    window.clearTimeout(this.state.timeout);
  }

    // this function shows the error message
  showError = () => {
    this.setState({show: true})
  }

  render() {
    return (
      <div>
        {this.state.show ? (<div><h1>Uh Oh...</h1><p>Well this is embarrassing. It seems there was an issue with getting the map. Please try again later.</p></div>) : (<div><h1>Getting The Google Maps</h1></div>)}
      </div>
    )
  }

}

export default MapError;