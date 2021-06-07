import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import SearchReplace from "../components/SearchReplace";
import { useFormFields } from "../libs/hooksLib";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [{ search, replace }, handleFieldChange, clearField, initializeFields] = useFormFields({
    search: "",
    replace: "",
  });
  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) return;
      try {
        const notes = await loadNotes();
        if (search) {
          setNotes(notes.filter((note) =>
            note.content && note.content.includes(search)
          ))
        } else {
          setNotes(notes);
        }
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    onLoad();
  }, [isAuthenticated, search]);

  function highlightText(text) {
    if (!search) return text
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <span>
        {parts.map((part, key) =>
          part.toLowerCase() === search.toLowerCase()
            ? <mark className="p-0" key={key}>{part}</mark>
            : part
        )}
      </span>
    )
  }

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  async function replaceNotes(fields) {
    setIsLoading(true)
    notes.map(async (note) => {
      await API.put("notes", `/notes/${note.noteId}`, {
        body: {...note, content: note.content.replaceAll(fields.search, fields.replace)}
      }).then(() => {
        initializeFields()
      })
    })
  }

  function renderNotesList(notes) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {highlightText(content.trim().split("\n")[0])}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
        <div className="pt-3">
          <Link to="/login" className="btn btn-info btn-lg mr-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <div className="pb-3 mt-4 mb-3 border-bottom">
          <h2 className="d-inline mr-4">Your Notes</h2>
           <SearchReplace
            isLoading={isLoading}
            onSubmit={replaceNotes}
            fields={{ search, replace }}
            handleFieldChange={handleFieldChange}
            clearField={clearField}
          />
        </div>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
