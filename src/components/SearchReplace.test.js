import { fireEvent, render, screen } from '@testing-library/react';
import SearchReplace from './SearchReplace';

test('should initially render a loader button with loading animation', () => {
  render(
    <SearchReplace
      isLoading={true}
      onSubmit={() => jest.fn()}
      fields={{ search: '', replace: '' }}
      handleFieldChange={() => jest.fn()}
      clearField={() => jest.fn()}
    />
  );
  const loaderButton = screen.getByTestId("loader_button");
  expect(loaderButton.firstChild).toHaveClass("spinning");
});

test('should render search and replace inputs with proper placeholders', () => {
  render(
    <SearchReplace
      isLoading={false}
      onSubmit={() => jest.fn()}
      fields={{ search: '', replace: '' }}
      handleFieldChange={() => jest.fn()}
      clearField={() => jest.fn()}
    />
  );
  const searchInput = screen.getByTestId("search_input");
  const replaceInput = screen.getByTestId("replace_input");
  expect(searchInput.placeholder).toBe("Search Notes");
  expect(replaceInput.placeholder).toBe("Replace Text");
});

test('should trigger handleFieldChange when search input is changed', () => {
  const handleFieldChangeSpy = jest.fn()
  render(
    <SearchReplace
      isLoading={false}
      onSubmit={jest.fn()}
      fields={{ search: '', replace: '' }}
      handleFieldChange={handleFieldChangeSpy}
      clearField={jest.fn()}
    />
  );
  const searchInput = screen.getByTestId("search_input");
  expect(handleFieldChangeSpy).not.toHaveBeenCalled();
  fireEvent.change(searchInput, { target: { value: 'test' } })
  expect(handleFieldChangeSpy).toHaveBeenCalled();
});

test('should trigger handleFieldChange when replace input is changed', () => {
  const handleFieldChangeSpy = jest.fn()
  render(
    <SearchReplace
      isLoading={false}
      onSubmit={jest.fn()}
      fields={{ search: '', replace: '' }}
      handleFieldChange={handleFieldChangeSpy}
      clearField={jest.fn()}
    />
  );
  const replaceInput = screen.getByTestId("replace_input");
  expect(handleFieldChangeSpy).not.toHaveBeenCalled();
  fireEvent.change(replaceInput, { target: { value: 'test' } })
  expect(handleFieldChangeSpy).toHaveBeenCalled();
});

test('should render proper search and replace input values', () => {
  render(
    <SearchReplace
      isLoading={false}
      onSubmit={() => jest.fn()}
      fields={{ search: 'search test', replace: 'replace test' }}
      handleFieldChange={() => jest.fn()}
      clearField={() => jest.fn()}
    />
  );
  const searchInput = screen.getByTestId("search_input");
  const replaceInput = screen.getByTestId("replace_input");
  expect(searchInput.value).toBe("search test");
  expect(replaceInput.value).toBe("replace test");
});

test('should trigger clearField prop function with proper string array when search input clear button is pressed', () => {
  const clearFieldSpy = jest.fn()
  render(
    <SearchReplace
      isLoading={false}
      onSubmit={() => jest.fn()}
      fields={{ search: 'search test', replace: 'replace test' }}
      handleFieldChange={() => jest.fn()}
      clearField={clearFieldSpy}
    />
  );
  const searchClearButton = screen.getByTestId("search_clear");
  fireEvent.click(searchClearButton)
  expect(clearFieldSpy).toHaveBeenCalledWith("search");
});

test('should trigger clearField prop function with proper string array when replace input clear button is pressed', () => {
  const clearFieldSpy = jest.fn()
  render(
    <SearchReplace
      isLoading={false}
      onSubmit={jest.fn()}
      fields={{ search: 'search test', replace: 'replace test' }}
      handleFieldChange={jest.fn()}
      clearField={clearFieldSpy}
    />
  );
  const searchClearButton = screen.getByTestId("replace_clear");
  fireEvent.click(searchClearButton)
  expect(clearFieldSpy).toHaveBeenCalledWith("replace");
});

test('should trigger onSubmit prop function with proper param object containing search and replace inputs when replace button is pressed', () => {
  const onSubmitSpy = jest.fn()
  render(
    <SearchReplace
      isLoading={false}
      onSubmit={onSubmitSpy}
      fields={{ search: 'search test', replace: 'replace test' }}
      handleFieldChange={jest.fn()}
      clearField={jest.fn()}
    />
  );
  const submitButton = screen.getByTestId("loader_button");
  fireEvent.click(submitButton)
  expect(onSubmitSpy).toHaveBeenCalledWith({ search: "search test", replace: "replace test" });
});