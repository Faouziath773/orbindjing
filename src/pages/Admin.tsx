import { useEffect, useState } from "react";
import api from "../lib/api";

type Candidate = {
  id: number;
  photo: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  age: number;
  city: string;
  motivation: string | null;
  transaction_id: string;
  created_at: string;
};

export default function Admin() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Chargement...");

  const loadCandidates = async (query = "") => {
    setStatus("Chargement...");
    try {
      const response = await api.get("/api/admin/candidates", {
        params: query ? { search: query } : undefined,
      });
      setCandidates(response.data?.data || []);
      setStatus("");
    } catch (error) {
      setStatus("Impossible de charger les données.");
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    loadCandidates(value);
  };

  return (
    <main className="container">
      <div className="table-card">
        <h1 className="section-title">Admin - Candidatures</h1>
        <div className="table-controls">
          <input
            type="search"
            placeholder="Rechercher par nom, téléphone, ville"
            value={search}
            onChange={handleSearch}
          />
          <a className="cta" href={`${api.defaults.baseURL}/api/admin/candidates.csv`}>
            Export CSV
          </a>
        </div>
        {status ? (
          <p className="status">{status}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th>Âge</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>
                    <img src={candidate.photo} alt={candidate.first_name} />
                  </td>
                  <td>
                    {candidate.first_name} {candidate.last_name}
                  </td>
                  <td>{candidate.phone}</td>
                  <td>{candidate.city}</td>
                  <td>{candidate.age}</td>
                  <td>{new Date(candidate.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
