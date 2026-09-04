import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  BookOpen,
  Globe,
  Search,
  Download,
  LogOut,
  Eye,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Paid",
  "Enrolled",
  "Completed",
  "Not Proceeding",
] as const;

type StatusType = (typeof STATUS_OPTIONS)[number];

interface Registration {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  course: string;
  position: string;
  company: string;
  maritime_experience: string;
  message: string;
  consent: boolean;
  status: string;
  email_notification_status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Paid: "bg-green-100 text-green-700",
  Enrolled: "bg-purple-100 text-purple-700",
  Completed: "bg-emerald-100 text-emerald-700",
  "Not Proceeding": "bg-red-100 text-red-700",
};

export default function Admin() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("dma_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (courseFilter !== "all") {
        query = query.eq("course", courseFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRegistrations((data as Registration[]) || []);
    } catch {
      console.error("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, courseFilter]);

  useEffect(() => {
    if (loggedIn) {
      fetchRegistrations();
    }
  }, [loggedIn, fetchRegistrations]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setLoggedIn(true);
    } catch {
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
    navigate("/");
  };

  const updateStatus = async (id: number, newStatus: StatusType) => {
    try {
      const { error } = await supabase
        .from("dma_registrations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg({ ...selectedReg, status: newStatus });
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.country.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      r.course.toLowerCase().includes(q)
    );
  });

  const totalRegistrations = registrations.length;
  const newRegistrations = registrations.filter(
    (r) => r.status === "New"
  ).length;

  const courseCounts: Record<string, number> = {};
  registrations.forEach((r) => {
    courseCounts[r.course] = (courseCounts[r.course] || 0) + 1;
  });

  const countryCounts: Record<string, number> = {};
  registrations.forEach((r) => {
    countryCounts[r.country] = (countryCounts[r.country] || 0) + 1;
  });

  const uniqueCourses = Array.from(
    new Set(registrations.map((r) => r.course))
  );

  const exportCSV = () => {
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "Country",
      "Course",
      "Position",
      "Company",
      "Maritime Experience",
      "Message",
      "Consent",
      "Status",
      "Email Notification Status",
      "Created At",
    ];
    const rows = filteredRegistrations.map((r) => [
      r.id,
      r.full_name,
      r.email,
      r.phone,
      r.country,
      r.course,
      r.position,
      r.company,
      r.maritime_experience,
      r.message,
      r.consent ? "Yes" : "No",
      r.status,
      r.email_notification_status,
      new Date(r.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dma-registrations-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Login screen
  if (!loggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-slate-900">DMA Admin Login</CardTitle>
            <p className="text-sm text-slate-500">
              Sign in to manage registrations
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@deemarineanalytics.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  {loginError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                disabled={loggingIn}
              >
                {loggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="section-padding bg-slate-50 min-h-screen">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-slate-900">Registration Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage DMA Institute class registrations
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {totalRegistrations}
                </p>
                <p className="text-sm text-slate-500">Total Registrations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {newRegistrations}
                </p>
                <p className="text-sm text-slate-500">New Registrations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {Object.keys(courseCounts).length}
                </p>
                <p className="text-sm text-slate-500">Courses Selected</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {Object.keys(countryCounts).length}
                </p>
                <p className="text-sm text-slate-500">Countries</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course & Country Breakdown */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">
                Registrations by Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(courseCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([course, count]) => (
                  <div
                    key={course}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-700 truncate mr-2">{course}</span>
                    <Badge variant="secondary" className="shrink-0">
                      {count}
                    </Badge>
                  </div>
                ))}
              {Object.keys(courseCounts).length === 0 && (
                <p className="text-sm text-slate-400">No data yet</p>
              )}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">
                Registrations by Country
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(countryCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([country, count]) => (
                  <div
                    key={country}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-700">{country}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
              {Object.keys(countryCounts).length === 0 && (
                <p className="text-sm text-slate-400">No data yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, country, company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {uniqueCourses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Registration Detail Modal */}
        {selectedReg && (
          <Card className="border-0 shadow-sm mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Registration Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReg(null)}
                  className="cursor-pointer"
                >
                  Close
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Full Name:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.full_name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Country:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.country}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Course:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.course}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Position:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.position || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Company:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.company || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Maritime Experience:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.maritime_experience || "N/A"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Message:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {selectedReg.message || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Submitted:</span>{" "}
                  <span className="text-slate-900 font-medium">
                    {new Date(selectedReg.created_at).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{" "}
                  <Badge className={STATUS_COLORS[selectedReg.status] || "bg-slate-100 text-slate-700"}>
                    {selectedReg.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Label className="text-sm text-slate-500">Update Status</Label>
                <Select
                  value={selectedReg.status}
                  onValueChange={(value) =>
                    updateStatus(selectedReg.id, value as StatusType)
                  }
                >
                  <SelectTrigger className="mt-1 w-full sm:w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registrations Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        Loading registrations...
                      </TableCell>
                    </TableRow>
                  ) : filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No registrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium text-slate-900">
                          {reg.full_name}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {reg.email}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm max-w-[200px] truncate">
                          {reg.course}
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          {reg.country}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              STATUS_COLORS[reg.status] ||
                              "bg-slate-100 text-slate-700"
                            }
                          >
                            {reg.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedReg(reg)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Select
                              value={reg.status}
                              onValueChange={(value) =>
                                updateStatus(reg.id, value as StatusType)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}