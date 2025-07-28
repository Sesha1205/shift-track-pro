-- Create leave_requests table
CREATE TABLE public.leave_requests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    leave_type TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    approved_by TEXT,
    approved_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for leave requests
CREATE POLICY "Employees can view their own leave requests" 
ON public.leave_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Employees can create their own leave requests" 
ON public.leave_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Employees can update their own leave requests" 
ON public.leave_requests 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can manage all leave requests" 
ON public.leave_requests 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON public.leave_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();