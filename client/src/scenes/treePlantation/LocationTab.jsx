import { Box } from '@mui/material';
import React from 'react'
import Button from 'components/Button';
import GoogleMap from 'components/GoogleMap';
import MapComponent from './MapComponent';
const LocationTab = () => {
  return (
    <Box display="flex">
        <Box mt={5} sx={{ width: "50%", ml: "auto", mr: "auto", textAlign: "center" }}>
          {/* <GoogleMap /> */}

          <MapComponent/>
          <Box mt={3}>
            <Button label="Search" />
          </Box>
        </Box>
    </Box>
  )
}

export default LocationTab;