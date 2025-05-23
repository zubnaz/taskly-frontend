import {useAppDispatch, useRootState} from "../../redux/hooks.ts";
import { useEffect, useRef, useState } from "react";
import { deleteTable, getTablesByUser } from "../../redux/actions/tablesAction.ts";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/table/main.scss";

export default function TablesListPage() {
    const tables = useRootState((state) => state.table.listOfTables);
    const dispatch = useAppDispatch();
    const workspaceContainerRef = useRef<HTMLDivElement | null>(null);
    const [workSpaceOverflowY, setWorkspaceOverflowY] = useState<"auto" | "scroll">("auto");
    const jwtUserId = useRootState(s => s.authenticate.userProfile?.id);
    const solanaUserId = useRootState(s => s.authenticate.solanaUserProfile?.id);
    const navigate = useNavigate();
    const [, setIsLoading] = useState<boolean>(false);
    const [, setError] = useState<string | null>(null);
    const authMethod = useRootState(s => s.authenticate.authMethod);

    const fetchTables = async (userId: string | undefined) => {
        if (userId) {
            await dispatch(getTablesByUser(userId));
        }
    };

    const handleDeleteTable = async (tableId: string) => {
        try {
            setIsLoading(true);
            await dispatch(deleteTable(tableId));
            checkAuthMethodFetchTables();
        } catch {
            setError("Failed to delete table. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const checkAuthMethodFetchTables = () => {
        if (authMethod === "jwt" && jwtUserId) {
            fetchTables(jwtUserId);
        } else if (authMethod === "solana" && solanaUserId) {
            fetchTables(solanaUserId);
        }
    };

    useEffect(() => {
        checkAuthMethodFetchTables();
    }, [authMethod, jwtUserId, solanaUserId]);

    const handleCreateTableClick = () => {
        navigate('/tables/create');
    };

    useEffect(() => {
        if (workspaceContainerRef.current) {
            setWorkspaceOverflowY(
                workspaceContainerRef.current.offsetHeight < workspaceContainerRef.current.scrollHeight
                    ? "scroll"
                    : "auto"
            );
        }
    }, [workspaceContainerRef.current]);

    return (
        <div className="tables-page" ref={workspaceContainerRef} style={{ overflowY: workSpaceOverflowY }}>
            <header className="tables-header">
                <h1>
                    <span className="gradient-text">📋 My Tables</span>
                </h1>
                <button className="create-table-btn" onClick={handleCreateTableClick}>
                    <span className="icon">＋</span> Create
                </button>
            </header>
            <div className="tables-list">
                {tables && tables.length > 0 ? (
                    tables.map((table, index) => (
                        <div key={index} className="table-item">
                            <Link to={`${table.id}`} key={table.id} className="table-name-link">
                                <span>{table.name}</span>
                            </Link>
                            <div className="buttons-container">
                                <button className="edit-btn" onClick={() => navigate(`edit/${table.id}`)}>
                                    <svg
                                        className="edit-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        fill="#ffffff"
                                    >
                                        <path
                                            d="M3 17.25V21h3.75L17.39 12.36l-3.75-3.75L3 17.25zm12.74-7.38l3.75 3.75c.43.43.43 1.13 0 1.56l-6 6a1.12 1.12 0 0 1-1.56 0l-3.75-3.75a1.12 1.12 0 0 1 0-1.56l6-6a1.12 1.12 0 0 1 1.56 0z"
                                        />
                                    </svg>
                                </button>

                                <button className="delete-btn" onClick={() => handleDeleteTable(table.id)}>
                                    <svg
                                        className="trash-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        width="20"
                                        fill="#ffffff"
                                    >
                                        <path d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/>
                                    </svg>
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <p>No tables available. Create one!</p>
                )}
            </div>
        </div>
    );
}