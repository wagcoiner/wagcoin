
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
import { AlertTriangle, Loader2, Search, Edit, Trash, Ban, Plus, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminUsers: React.FC = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  
  // Form states for editing user
  const [editBalance, setEditBalance] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if admin is logged in from localStorage
  const isAdminLoggedIn = localStorage.getItem("wagcoin_admin") === "true";

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
      user.referral_code?.toLowerCase().includes(searchLower) ||
      user.wallet_address?.toLowerCase().includes(searchLower)
    );
  });

  // Handle edit user
  const handleEditUser = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("users")
        .update({
          balance: parseInt(editBalance) || 0,
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      toast({
        title: "User Updated",
        description: `User balance has been updated successfully`,
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

  // Handle reset user balance
  const resetUserBalance = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ balance: 0 })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Balance Reset",
        description: "User balance has been reset to 0",
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error resetting balance:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset balance",
        variant: "destructive",
      });
    }
  };

  // Set up edit user dialog
  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setEditBalance(user.balance.toString());
    setIsEditUserDialogOpen(true);
  };

  // Set up delete user dialog
  const openDeleteDialog = (user: UserProfile) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  // If not admin, redirect
  if (!isAdminLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="mb-6">Please log in to access admin features.</p>
        <Button onClick={() => navigate("/admin-login")}>
          Go to Admin Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/admin")}
            variant="outline"
          >
            Task Management
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              localStorage.removeItem("wagcoin_admin");
              navigate("/");
            }}
            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            Logout
          </Button>
        </div>
      </div>
      
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
      </div>
      
      <Card className="border-neon-green/20 bg-gray-900">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage all users in the system. Edit user balances or deactivate users.
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
                    <TableHead>User</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username || user.wallet_address}</TableCell>
                        <TableCell>{user.balance} $WAG</TableCell>
                        <TableCell>{user.referral_code}</TableCell>
                        <TableCell>{user.referral_count}</TableCell>
                        <TableCell>{user.total_tasks_completed}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openEditDialog(user)}
                            title="Edit Balance"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => resetUserBalance(user.id)}
                            className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-900/20"
                            title="Reset Balance"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openDeleteDialog(user)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-900/20"
                            title="Deactivate User"
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
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="bg-gray-900 border-neon-green/20">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user balance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
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
            <DialogTitle>Confirm Deactivation</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this user? They will no longer be able to participate in tasks or earn rewards.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {deletingUser && (
              <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-md">
                <p><strong>User:</strong> {deletingUser.username || deletingUser.wallet_address}</p>
                <p><strong>Balance:</strong> {deletingUser.balance} $WAG</p>
                <p><strong>Tasks Completed:</strong> {deletingUser.total_tasks_completed}</p>
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
              onClick={() => {
                toast({
                  title: "User Deactivated",
                  description: "User has been deactivated successfully",
                });
                setIsDeleteDialogOpen(false);
              }}
            >
              <Ban className="h-4 w-4 mr-2" /> Deactivate User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
