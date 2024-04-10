/* eslint-disable react/prop-types */
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add some cities to get started" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((c) => (
        <CityItem key={c.id} city={c} />
      ))}
    </ul>
  );
}

export default CityList;
