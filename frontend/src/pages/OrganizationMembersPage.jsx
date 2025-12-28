import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import Navbar from "../components/Navbar";

const OrganizationMembersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);

  /* -------------------- Guards -------------------- */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.organization) {
      navigate("/organizations/create");
    }
  }, [user, navigate]);

  /* -------------------- Fetch Organization -------------------- */
  const fetchOrganizationAndMembers = async () => {
    if (!user?.organization) return;

    setLoadingMembers(true);
    try {
      const res = await api.get("/api/organizations/my");

      // Backend returns the organization directly
      setOrganization(res.data);
      setMembers(res.data.members || []);
    } catch (err) {
      console.error("Error fetching organization:", err);
      setMessage(
        err.response?.data?.message || "Failed to load organization data."
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchOrganizationAndMembers();
  }, [user?.organization]);

  /* -------------------- Invite Member -------------------- */
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post(
        `/api/organizations/${organization._id}/members`,
        { email: inviteEmail }
      );

      setMessage(res.data.message || "Member invited successfully.");
      setInviteEmail("");
      fetchOrganizationAndMembers();
    } catch (err) {
      console.error("Invite error:", err);
      setMessage(err.response?.data?.message || "Failed to invite member.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Remove Member -------------------- */
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the organization?")) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await api.delete(
        `/api/organizations/${organization._id}/members/${memberId}`
      );

      setMessage(res.data.message || "Member removed.");
      fetchOrganizationAndMembers();
    } catch (err) {
      console.error("Remove error:", err);
      setMessage(err.response?.data?.message || "Failed to remove member.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Loading State -------------------- */
  if (loadingMembers || !user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-64 text-gray-600">
          Loading organization members...
        </div>
      </div>
    );
  }

  /* -------------------- No Organization -------------------- */
  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-xl mx-auto mt-10 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <h3 className="font-bold text-yellow-800 mb-2">No Organization</h3>
          <p className="text-yellow-700 mb-4">
            You are not part of any organization yet.
          </p>
          <Link
            to="/organizations/create"
            className="text-yellow-800 underline font-medium"
          >
            Create your first organization
          </Link>
        </div>
      </div>
    );
  }

  /* -------------------- Page UI -------------------- */
  const isOwner = organization.owner?._id === user.id;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Manage Organization Members</h2>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-2xl font-semibold mb-4">{organization.name}</h3>

          {/* Invite Form */}
          {isOwner && (
            <form onSubmit={handleInviteSubmit} className="mb-6 space-y-3">
              <input
                type="email"
                placeholder="Enter member email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full border rounded px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Inviting..." : "Invite Member"}
              </button>
            </form>
          )}

          {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

          {/* Members List */}
          <h4 className="text-xl font-semibold mb-3">Members</h4>

          {members.length === 0 ? (
            <p className="text-gray-500">No members yet.</p>
          ) : (
            <ul className="space-y-3">
              {members.map((member) => (
                <li
                  key={member._id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div>
                    <p className="font-medium">
                      {member.name}
                      {organization.owner?._id === member._id && (
                        <span className="ml-2 text-xs text-blue-600">
                          (Owner)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>

                  {isOwner && member._id !== user.id && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationMembersPage;
