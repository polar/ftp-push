class Camera < ActiveRecord::Base
  require "digest/sha1"
  
  belongs_to :user
  
  FTP_UPLOAD_BASE = Venuespy::Application.config.ftp_upload_directory
  
  # These attributes are not saved in the database.
  attr_accessor :password, :password_confirmation
  
  before_validation :create_dirname, :create_libpam_mysql_password
  
  validate :validate_password_confirmation

  before_create :create_directory
  
  validates_presence_of   :ftp_userid
  validates_uniqueness_of :ftp_userid
  validates_format_of     :ftp_userid, :with => /\A[a-zA-Z_][a-zA-Z0-9_\-]*\Z/i
 
  validates_presence_of :ftp_upload_directory
  validates_presence_of :ftp_sha1_password
  
  class NoPictureException < StandardError
  end
  
  def validate_password_confirmation
    # If id == nil then we haven't created it yet and we need a password.
    # Otherwise, we leave it unchanged.
    if password.empty? && self.id == nil
      self.errors.add(:password, "cannot be empty")
    end
    if password != password_confirmation
      self.errors.add(:password_confirmation, "does not match password")
    end
  end
  
  ##
  # This function returns the most recent file in the
  # ftp upload directory. If there are none, then it
  # raises a NoPictureException.
  #
  def current
    entries = Dir.glob("#{self.ftp_upload_directory}/*.jpg")
    # File.mtime is modified time.
    res = entries.max_by {|f| File.mtime(f)}
    if (res == nil)
      raise NoPictureException.new("No Latest Picture")
    end
    return res
  end
  
  private 
  
  def create_dirname
    if self.ftp_upload_directory == nil || self.ftp_upload_directory.empty?
      self.ftp_upload_directory = "#{FTP_UPLOAD_BASE}/#{ftp_userid}"
    end
  end
  
  def create_directory
    dirname = self.ftp_upload_directory
    if !File.exists? dirname
      Dir.mkdir(dirname)
    end
  end
  
  def create_libpam_mysql_password
    # This is for the following pam_mysql specification: 
    # crypt=4 user=camera usercolumn=ftp_userid passwordcolumn=ftp_sha1_password
    self.ftp_sha1_password = Digest::SHA1.hexdigest(password)
  end
  
end
