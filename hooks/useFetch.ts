import { fireStore } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const useFetch = <T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionName) return;
    const collectionRef = collection(fireStore, collectionName);
    const q = query(collectionRef, ...constraints);

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as T[];
        setData(fetchedData);
        setloading(false);
      },
      (err) => {
        console.log("Error fetching data", err);
        setError(err.message);
        setloading(false);
      }
    );
    return () => unsub();
  }, dependencies);
  return { loading, data, error };
};

export default useFetch;

const styles = StyleSheet.create({});
