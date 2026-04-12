import { useForm, Controller } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import './FormPage.scss';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  age: number;
  gender: string;
  interests: string[];
  message: string;
  agree: boolean;
}

export default function FormPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const jsonData = JSON.stringify(data);
    localStorage.setItem('formData', jsonData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="form-page">
        <Card className="confirmation">
          <h2>Form Submitted Successfully!</h2>
          <p>Your data has been saved to localStorage.</p>
          <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="form-page">
      <header className="header">
        <h1>Complex Form</h1>
        <p>Fill out the form below.</p>
      </header>
      <main className="main-content">
        <Card className="form-card">
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form-group">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter your name"
              />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                {...register('age', {
                  required: 'Age is required',
                  min: { value: 18, message: 'Must be at least 18' },
                  valueAsNumber: true
                })}
                placeholder="Enter your age"
              />
              {errors.age && <span className="error">{errors.age.message}</span>}
            </div>

            <div className="form-group">
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={control}
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <span className="error">{errors.gender.message}</span>}
            </div>

            <div className="form-group">
              <Label>Interests</Label>
              <Controller
                name="interests"
                control={control}
                defaultValue={[]}
                rules={{ validate: value => (value as string[]).length > 0 || 'At least one interest is required' }}
                render={({ field }) => (
                  <div className="checkbox-group">
                    {['Reading', 'Sports', 'Music', 'Travel'].map(interest => (
                      <div key={interest} className="checkbox-item">
                        <Checkbox
                          id={interest}
                          checked={(field.value as string[]).includes(interest)}
                          onCheckedChange={(checked) => {
                            const current = (field.value as string[]).filter((i: string) => i !== interest);
                            if (checked) {
                              field.onChange([...current, interest]);
                            } else {
                              field.onChange(current);
                            }
                          }}
                        />
                        <Label htmlFor={interest}>{interest}</Label>
                      </div>
                    ))}
                  </div>
                )}
              />
              {errors.interests && <span className="error">{errors.interests.message}</span>}
            </div>

            <div className="form-group">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                {...register('message', { required: 'Message is required' })}
                placeholder="Enter your message"
              />
              {errors.message && <span className="error">{errors.message.message}</span>}
            </div>

            <div className="form-group">
              <Controller
                name="agree"
                control={control}
                rules={{ required: 'You must agree' }}
                render={({ field }) => (
                  <div className="checkbox-item">
                    <Checkbox
                      id="agree"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="agree">I agree to the terms</Label>
                  </div>
                )}
              />
              {errors.agree && <span className="error">{errors.agree.message}</span>}
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
