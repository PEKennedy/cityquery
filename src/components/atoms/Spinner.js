//Modified from the example at https://docs.nativebase.io/spinner
//Called cityspinner to avoid confusion with the nativebase component

import { HStack, Spinner, Heading } from "native-base";

const CitySpinner = ({label="loading",aLabel="loading"}) => {
    return <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel={aLabel} />
        <Heading color="primary.500" fontSize="md">
            {label}
        </Heading>
      </HStack>;
  };

export default CitySpinner;