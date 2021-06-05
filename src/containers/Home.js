import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import { Button, Form, FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import LoaderButton from "../components/LoaderButton"
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [replace, setReplace] = useState('');
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [fields, handleFieldChange] = useFormFields({
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

  async function replaceNotes() {
    if (!search) return
    setIsLoading(true)
    notes.map(async (note) => {
      await API.put("notes", `/notes/${note.noteId}`, {
        body: {...note, content: note.content.replaceAll(search, replace)}
      }).then(() => {
        setSearch('')
        setReplace('')
      })
    })
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    console.log(value, name)
    name === 'search'
      ? setSearch(value)
      : setReplace(value)
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
          <Form inline className="float-right" >
            <InputGroup className="mr-2">
              <FormControl
                disabled={isLoading}
                size="sm"
                onChange={handleInputChange}
                name="search"
                type="text"
                placeholder="Search Notes"
                value={search}
              />
                <InputGroup.Append>
                  <Button
                    size="sm"
                    disabled={!search}
                    onClick={() => setSearch('')}
                    variant="secondary"
                  >
                    X
                  </Button>
                </InputGroup.Append>
            </InputGroup>
            <InputGroup className="mr-2">
              <FormControl
                disabled={isLoading}
                size="sm"
                onChange={handleInputChange}
                name="replace"
                type="text"
                placeholder="Replace Text"
                value={replace}
              />
                <InputGroup.Append>
                  <Button
                    size="sm"
                    disabled={!replace}
                    onClick={() => setReplace('')}
                    variant="secondary"
                  >
                    X
                  </Button>
                </InputGroup.Append>
            </InputGroup>
            <LoaderButton
              disabled={!search || !replace}
              onClick={replaceNotes}
              isLoading={isLoading}
            >
              Replace
            </LoaderButton>
          </Form>
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
