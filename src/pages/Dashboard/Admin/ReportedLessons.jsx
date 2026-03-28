import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../../components/Spinner";

const ReportedLessons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => (await axiosSecure.get("/reports")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/lessons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      toast.success("Lesson deleted!");
      setSelected(null);
    },
  });

  const handleDelete = async (lessonId) => {
    const result = await Swal.fire({
      title: "Delete this reported lesson?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });
    if (result.isConfirmed) deleteMutation.mutate(lessonId);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🚩 Reported Lessons</h1>

      {reports.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p>No reports yet. Community is safe!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Lesson ID</th>
                  <th className="text-left px-5 py-3 font-medium">Report Count</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-700 font-mono text-xs">{r._id}</td>
                    <td className="px-5 py-3">
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {r.reportCount} reports
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(r)}
                          className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1 rounded-lg hover:bg-indigo-50"
                        >
                          View Reasons
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50"
                        >
                          Delete Lesson
                        </button>
                        <button
                          onClick={() => toast.success("Ignored!")}
                          className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50"
                        >
                          Ignore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reasons Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">🚩 Report Reasons</h3>
            <div className="space-y-3">
              {selected.reasons.map((r, i) => (
                <div key={i} className="bg-red-50 rounded-xl p-3">
                  <p className="text-sm font-medium text-red-700">{r.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">Reported by: {r.reporter}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full border border-gray-300 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedLessons;