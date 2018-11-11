import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import MapError from './MapError';


const mapStyles = {
  width: '100%',
  height: '100%'
},
  MAPS_API = 'AIzaSyDmX7sfNKoCwX4Ba7cTmjqGrf7chQmUMbQ',
  FOURSQUARE_CLIENT = 'JQH5O3VUGP3QXTGXXN355ONRTQFG0XPGHBS25BTWEPFNHFXB',
  FOURSQUARE_SECRET = 'KM0ZNE5OQYDXVA1CZNLZYND1LRO2I4UWAHN1U4ZQJFLZGFIT',
  FOURSQUARE_VERSION= '20180323';

class MapContainer extends Component {

  state = {
    showingInfoWindow: false,
    activeMarker: {},
    activeLocation: {},
    activeMarkerData: {},
    markers: [],
    markerProps: []
  };

  mapReady = (props, map) => {
    this.setState({map});
    this.updateMarkers(this.props.locations);
  }

  closeInfoWindow = () => {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null,
      activeMarkerData: {}
    });
  };

  burgerPlaceMatch = (props, data) => {
    let burgerMatch = data.response.venues.filter(restaurant => restaurant.name.includes(props.name) || props.name.includes(restaurant.name));
    return burgerMatch;
  }

  componentWillReceiveProps = (props) => {
    if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
      return;
    };
    this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
  }


  onMarkerClick = (props, marker, e) => {
    this.closeInfoWindow();

    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FOURSQUARE_CLIENT}&client_secret=${FOURSQUARE_SECRET}&v=${FOURSQUARE_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
    let headers = new Headers();
    let request = new Request(url, {
        method: 'GET',
        headers
    });

    let activeMarkerData;
    fetch(request)
      .then(response => response.json())
      .then(result => {
          let bpMatch = this.burgerPlaceMatch(props, result);
          activeMarkerData = {
            ...props,
            fs: bpMatch[0]
          };
          console.log('pass')

          if (activeMarkerData.fs) {
            let url = `https://api.foursquare.com/v2/venues/${bpMatch[0].id}/photos?client_id=${FOURSQUARE_CLIENT}&client_secret=${FOURSQUARE_SECRET}&v=${FOURSQUARE_VERSION}`;
            fetch(url)
              .then(response => response.json())
              .then(result => {
                activeMarkerData = {
                  ...activeMarkerData,
                  images: result.response.photos
                };
                this.setState({
                  showingInfoWindow: true,
                  activeMarker: marker,
                  activeMarkerData
                });
                console.log('pass2')
              })
          } else {
              this.setState({
                showingInfoWindow: true,
                activeMarker: marker,
                activeMarkerData
              });
              console.log('fail2')
          }
        })
        .catch(function() {
          console.log('fail');
  });

  }

  updateMarkers = (locations) => {
    if (!locations)
      return;
    this.state.markers.forEach(marker => marker.setMap(null));

    let markerProps = [];
    let markers = locations.map((location, index) => {
      let mProps = {
        key: index,
        index,
        name: location.name,
        position: location.pos,
        url: location.url
      };
      markerProps.push(mProps);

      let marker = new this.props.google.maps.Marker({
        position: location.pos,
        map: this.state.map,
      });
      marker.addListener('click', () => {
        this.onMarkerClick(mProps, marker, null);
      });
      return marker;
    })

    this.setState({ markers, markerProps });
  }

  render() {
    return (
      <Map
        role='application'
        aria-label='map'
        onReady={this.mapReady}
        google={this.props.google}
        zoom={13}
        style={mapStyles}
        initialCenter={{
         lat: 39.579966,
         lng: -104.878393
        }}
        onClick={this.closeInfoWindow}
      >
        {this.props.locations.map(location => (
          <Marker
            key={location.id}
            title={location.name}
            name={location.name}
            url={location.url}
            position={location.pos}
            onClick={this.onMarkerClick}
          />
        ))}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div className="location-info">
            <h1>{this.state.activeMarkerData.name}</h1>
            {this.state.activeMarkerData && this.state.activeMarkerData.url ? ( <h3><a href={this.state.activeMarkerData.url}>{this.state.activeMarkerData.url}</a></h3> ) : "" }
            {this.state.activeMarkerData && this.state.activeMarkerData.images ? ( <div><img alt = {"Picture of " + this.state.activeMarkerData.name} src={this.state.activeMarkerData.images.items[0].prefix + "100x100" + this.state.activeMarkerData.images.items[0].suffix }/></div> ) : <div><h3>No images available</h3></div> }
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: MAPS_API,
  LoadingContainer: MapError
})(MapContainer);