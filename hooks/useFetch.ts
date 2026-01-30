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
  constraints: QueryConstraint[] | null = [],
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // strict check: if constraints is null, or if any constraint is somehow invalid (though hard to check deep object), return.
    // The previous error "Function where() called with invalid data" happens during query construction usually.
    // If constraints array contains undefined, spread operator might behave oddly? No, likely the caller passed `where(..., undefined)`.
    // But we fixed the caller. Let's just ensure we don't try to query if constraints is null.

    if (!collectionName || !constraints) {
      setloading(false); // Ensure loading stops if we're not fetching
      return;
    }

    try {
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
        },
      );
      return () => unsub();
    } catch (e: any) {
      console.log("Error setting up query", e);
      setError(e.message);
      setloading(false);
      return;
    }
  }, [collectionName, constraints]);

  return { loading, data, error };
};

export default useFetch;

const styles = StyleSheet.create({});
