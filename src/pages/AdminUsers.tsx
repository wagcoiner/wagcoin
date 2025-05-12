
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserProfile } from "@/contexts/AuthContext";
import { AlertTriangle, Loader2, Search, Edit, Trash, Plus, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminUsers: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  
  // Form states for adding user
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newBalance, setNewBalance] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states for editing user
  const [editUsername, setEditUsername] = useState("");
  const [editBalance, setEditBalance] = useState("");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");

  // Fetch users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data as UserProfile[];
    }
  });

  // Handle search input
  const filteredUsers = users?.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.referral_code?.toLowerCase().includes(searchLower)
    );
  });

  // Handle add user
  const handleAddUser = async () => {
    if (!newEmail || !newPassword || !newUsername) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newEmail,
        password: newPassword,
        email_confirm: true
      });

      if (authError) throw authError;
      
      if (authData?.user) {
        // Update the profile
        const { error: updateError } = await supabase
          .from("users")
          .update({
            username: newUsername,
            balance: parseInt(newBalance) || 0
          })
          .eq("id", authData.user.id);

        if (updateError) throw updateError;

        toast({
          title: "User Created",
          description: `${newUsername} has been added successfully`,
        });
        
        // Reset form and close dialog
        setNewEmail("");
        setNewPassword("");
        setNewUsername("");
        setNewBalance("0");
        setIsAddUserDialogOpen(false);
        
        // Refresh user list
        refetch();
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit user
  const handleEditUser = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: editUsername,
          balance: parseInt(editBalance) || 0,
          role: editRole
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      toast({
        title: "User Updated",
        description: `${editUsername} has been updated successfully`,
      });
      
      setIsEditUserDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsSubmitting(true);
    
    try {
      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        deletingUser.id
      );

      if (authError) throw authError;

      toast({
        title: "User Deleted",
        description: `${deletingUser.username} has been removed`,
      });
      
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set up edit user dialog
  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setEditUsername(user.username || "");
    setEditBalance(user.balance.toString());
    setEditRole(user.role || "user");
    setIsEditUserDialogOpen(true);
  };

  // Set up delete user dialog
  const openDeleteDialog = (user: UserProfile) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  // If not admin, redirect
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="mb-6">You need admin privileges to view this page.</p>
        <Button onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => setIsAddUserDialogOpen(true)}
          className="bg-neon-green hover:bg-neon-green/90 text-black"
        >
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>
      
      <Card className="border-neon-green/20 bg-gray-900">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage all users in the system. Edit user details or delete users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 text-neon-green animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username || "No username"}</TableCell>
                        <TableCell>{user.balance} $WAG</TableCell>
                        <TableCell>{user.referral_code}</TableCell>
                        <TableCell>{user.referral_count}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === "admin" ? "bg-neon-green/20 text-neon-green" : "bg-gray-700/50 text-gray-300"
                          }`}>
                            {user.role || "user"}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-900/20"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        {searchTerm ? "No matching users found" : "No users found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="bg-gray-900 border-neon-green/20">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account in the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input 
                id="email" 
                placeholder="user@example.com" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password*</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Display Name*</Label>
              <Input 
                id="username" 
                placeholder="Username" 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Starting Balance (WAG)</Label>
              <Input 
                id="balance" 
                type="number"
                placeholder="0" 
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsAddUserDialogOpen(false)}
              className="border-gray-700"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="bg-gray-900 border-neon-green/20">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Display Name</Label>
              <Input 
                id="edit-username" 
                placeholder="Username" 
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-balance">Balance (WAG)</Label>
              <Input 
                id="edit-balance" 
                type="number"
                placeholder="0" 
                value={editBalance}
                onChange={(e) => setEditBalance(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <select
                id="edit-role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as "user" | "admin")}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditUserDialogOpen(false)}
              className="border-gray-700"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button 
              onClick={handleEditUser}
              className="bg-neon-green hover:bg-neon-green/90 text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-neon-green/20">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {deletingUser && (
              <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-md">
                <p><strong>Username:</strong> {deletingUser.username}</p>
                <p><strong>Balance:</strong> {deletingUser.balance} $WAG</p>
                <p><strong>Role:</strong> {deletingUser.role || "user"}</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-700"
            >
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" /> Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
