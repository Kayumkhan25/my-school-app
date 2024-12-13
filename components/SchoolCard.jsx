import styles from '../styles/showSchools.module.css';

export default function SchoolCard({ school }) {
  return (
    <div className={styles.card}>
      <img src={`/schoolImages/${school.image}`} alt={school.name} />
      <h3>{school.name}</h3>
      <p>{school.address}</p>
      <p>{school.city}</p>
    </div>
  );
}
