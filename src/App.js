import React, {Component} from 'react';
import LocData from './LocData.json';
import MapContainer from './components/MapContainer';
import LocDrawer from './components/LocDrawer';

class App extends Component {
  state = {
    lat: 39.579966,
    lng: -104.878393,
    zoom: 13,
    all: LocData,
    filter: null,
    open: false,
    selectedIndex: null
  }

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filter: this.filterLoc(this.state.all, "")
    });
  }

  toggleDrawer = () => {
    this.setState({
      selectedIndex: null,
      open: !this.state.open
    });
  }

  updateQuery = (query) => {
    this.setState({
      ...this.state,
      selectedIndex: null,
      filter: this.filterLoc(this.state.all, query)
    });
  }

  filterLoc = (locations, query) => {
    let filteredList = locations.filter(restaurant => restaurant.name.toUpperCase().includes(query.toUpperCase()));
    return filteredList;
  }

  clickList = (index) => {
    this.setState({
      selectedIndex: index,
      open: !this.state.open
    })
  }

  styles = {
    menu: {
      position: "absolute",
      marginTop: '-45px'
    },
    h2style: {
      paddingLeft: "60px"
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <h2 style={this.styles.h2style}>Burger Joints in Centennial, CO</h2>
          <button onClick={this.toggleDrawer} style={this.styles.menu}>Menu</button>
        </div>
        <MapContainer
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
          locations={this.state.filter}
          selectedIndex={this.state.selectedIndex}
        />
        <LocDrawer
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          locations={this.state.filter}
          filterLocations={this.updateQuery }
          clickList={this.clickList}
        />
      </div>
    );
  }
}

export default App;