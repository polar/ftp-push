class CreateCameras < ActiveRecord::Migration
  def self.up
    create_table :cameras, :force => true do |t|
      t.string     :name
      t.text       :description
      
      # The following fields are for the libpam_mysql integration for VsFTP
      t.string     :ftp_userid
      t.string     :ftp_sha1_password # Should be salt+crypted_password
      
      # This will be constructed from the ftp_userid at create time, if not set.
      t.string     :ftp_upload_directory

      t.timestamps
    end
  end

  def self.down
    drop_table :cameras
  end
end
