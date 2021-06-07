import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import LoaderButton from "./LoaderButton";

function SearchReplace({ isLoading, onSubmit, fields, handleFieldChange, clearField }) {
  async function handleSubmitClick(event) {
    event.preventDefault();
    onSubmit(fields)
  }

  return (
    <Form inline className="float-right" onSubmit={handleSubmitClick}>
      <Form.Group className="mr-2" controlId="search">
        <InputGroup>
          <Form.Control
            data-testid="search_input"
            disabled={isLoading}
            size="sm"
            onChange={handleFieldChange}
            name="search"
            type="text"
            placeholder="Search Notes"
            value={fields.search}
          />
          <InputGroup.Append>
            <Button
              data-testid="search_clear"
              size="sm"
              disabled={!fields.search}
              onClick={() => clearField("search")}
              variant="secondary"
            >
              X
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
      <Form.Group className="mr-2" controlId="replace" data-testid="replace_form">
        <InputGroup>
          <Form.Control
            data-testid="replace_input"
            disabled={isLoading}
            size="sm"
            onChange={handleFieldChange}
            name="replace"
            type="text"
            placeholder="Replace Text"
            value={fields.replace}
          />
          <InputGroup.Append>
            <Button
              data-testid="replace_clear"
              size="sm"
              disabled={!fields.replace}
              onClick={() => clearField("replace")}
              variant="secondary"
            >
              X
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
      <LoaderButton
        disabled={!fields.search || !fields.replace}
        data-testid="loader_button"
        type="submit"
        isLoading={isLoading}
      >
        Replace
      </LoaderButton>
    </Form>
  );
}

export default SearchReplace;
