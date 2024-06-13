/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render, screen, fireEvent } from 'spec/helpers/testing-library';
import { NotificationMethod } from './NotificationMethod';
import { NotificationSetting } from '../types';

const mockOnUpdate = jest.fn();
const mockOnRemove = jest.fn();
const mockOnInputChange = jest.fn();
const mockSetErrorSubject = jest.fn();

const mockSetting: NotificationSetting = {
  method: 'Email',
  recipients: 'test@example.com',
  options: ['Email', 'Slack', 'SlackV2'],
};

const mockEmailSubject = 'Test Subject';
const mockDefaultSubject = 'Default Subject';

describe('NotificationMethod', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    render(
      <NotificationMethod
        setting={mockSetting}
        index={0}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        onInputChange={mockOnInputChange}
        email_subject={mockEmailSubject}
        defaultSubject={mockDefaultSubject}
        setErrorSubject={mockSetErrorSubject}
      />,
    );

    expect(screen.getByText('Notification Method')).toBeInTheDocument();
    expect(
      screen.getByText('Email subject name (optional)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Email recipients')).toBeInTheDocument();
  });

  it('should call onUpdate when the method is changed', () => {
    render(
      <NotificationMethod
        setting={mockSetting}
        index={0}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        onInputChange={mockOnInputChange}
        email_subject={mockEmailSubject}
        defaultSubject={mockDefaultSubject}
        setErrorSubject={mockSetErrorSubject}
      />,
    );

    const select = screen.getByLabelText('Delivery method');
    fireEvent.change(select, { target: { value: 'Slack' } });

    expect(mockOnUpdate).toHaveBeenCalledWith(0, {
      ...mockSetting,
      method: 'Slack',
      recipients: '',
    });
  });

  it('should call onRemove when the delete button is clicked', () => {
    render(
      <NotificationMethod
        setting={mockSetting}
        index={1}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        onInputChange={mockOnInputChange}
        email_subject={mockEmailSubject}
        defaultSubject={mockDefaultSubject}
        setErrorSubject={mockSetErrorSubject}
      />,
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    expect(mockOnRemove).toHaveBeenCalledWith(1);
  });

  it('should call onRecipientsChange when the recipients value is changed', () => {
    render(
      <NotificationMethod
        setting={mockSetting}
        index={0}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        onInputChange={mockOnInputChange}
        email_subject={mockEmailSubject}
        defaultSubject={mockDefaultSubject}
        setErrorSubject={mockSetErrorSubject}
      />,
    );

    const recipientsInput = screen.getByTestId('recipients');
    fireEvent.change(recipientsInput, {
      target: { value: 'test1@example.com' },
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(0, {
      ...mockSetting,
      recipients: 'test1@example.com',
    });
  });

  it('should call onSlackRecipientsChange when the slack recipients value is changed', () => {
    render(
      <NotificationMethod
        setting={{ ...mockSetting, method: 'Slack' }}
        index={0}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        onInputChange={mockOnInputChange}
        email_subject={mockEmailSubject}
        defaultSubject={mockDefaultSubject}
        setErrorSubject={mockSetErrorSubject}
      />,
    );

    const slackRecipientsInput = screen.getByLabelText('Select owners');
    fireEvent.change(slackRecipientsInput, [
      { label: 'User 1', value: 'user1' },
      { label: 'User 2', value: 'user2' },
    ]);

    expect(mockOnUpdate).toHaveBeenCalledWith(0, {
      ...mockSetting,
      recipients: 'user1,user2',
    });
  });

  it('should call onSubjectChange when the email subject value is changed', () => {
    render(
      <NotificationMethod
        setting={mockSetting}
        index={0}
        onUpdate={mockOnUpdate}
        onRemove={mockOnRemove}
        onInputChange={mockOnInputChange}
        email_subject={mockEmailSubject}
        defaultSubject={mockDefaultSubject}
        setErrorSubject={mockSetErrorSubject}
      />,
    );

    const subjectInput = screen.getByPlaceholderText('Default Subject');
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });

    expect(mockOnInputChange).toHaveBeenCalled();
  });
});
