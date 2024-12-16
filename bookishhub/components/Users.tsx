import React from 'react';
import { getAllUsers, updateUser } from '@/lib/authentication';

type User = {
    id: string;
    name: string | null;
    email: string | null;
    points: number;
    isAdmin: boolean;
    image: string | null;
};

const Users = async () => {
    const users: User[] = await getAllUsers(); 

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Points</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name || 'N/A'}</td>
                            <td>{user.email || 'N/A'}</td>
                            <td>{user.points}</td>
                            <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
